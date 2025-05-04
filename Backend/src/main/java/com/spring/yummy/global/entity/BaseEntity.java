package com.spring.yummy.global.entity;

import com.spring.yummy.member.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime deletedAt;

    @Column
    private String createdBy;

    @Column
    private String updatedBy;

    @Column
    private String deletedBy;

    protected void updateAuditInfo(String userName) {
        this.updatedBy = userName;
    }

    protected void initAuditInfo(String userName) {
        this.createdBy = userName;
        this.updatedBy = userName;
    }
}